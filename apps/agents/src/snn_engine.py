import torch
import torch.nn as nn
import time
import json
import os

class LeakyIntegrateAndFireCell(nn.Module):
    def __init__(self, input_dim: int, output_dim: int, decay=0.9, threshold=1.0):
        super(LeakyIntegrateAndFireCell, self).__init__()
        # Initialize biological synapse weight connections
        self.synapse_weights = nn.Parameter(torch.randn(input_dim, output_dim) * 0.1)
        self.decay = decay
        self.threshold = threshold
        self.reset_membrane()

    def reset_membrane(self):
        self.membrane_potential = None

    def forward(self, input_spikes: torch.Tensor) -> torch.Tensor:
        """
        Calculates membrane potential updates and fires action potential spikes.
        """
        if self.membrane_potential is None:
            self.membrane_potential = torch.zeros(
                input_spikes.size(0), self.synapse_weights.size(1), device=input_spikes.device
            )

        # Apply biological passive leakage and accumulate current inputs
        accumulated_current = torch.matmul(input_spikes, self.synapse_weights)
        self.membrane_potential = (self.membrane_potential * self.decay) + accumulated_current

        # Fire spikes when exceeding biological action potential threshold
        fired_spikes = (self.membrane_potential >= self.threshold).float()

        # Reset membrane potential back to resting state post-firing
        self.membrane_potential = self.membrane_potential * (1.0 - fired_spikes)

        return fired_spikes


class EdgeSNNClassifier:
    def __init__(self, input_features=128, classes=4):
        self.lif_layer = LeakyIntegrateAndFireCell(input_features, classes)
        self.classes_labels = ["Healthy Leaf", "Rice Blast Spot", "Bacterial Canker", "Aphid Necrosis"]
        self.outage_buffer_path = os.path.join(os.path.dirname(__file__), "outage_pest_alerts.json")

    def classify_and_buffer(self, feature_vector: list, network_available=False):
        """
        Runs SNN classification. If backhaul is down, buffer alert locally.
        """
        # Convert raw analog float features to discrete biological spikes (Poisson rate encoding)
        features_tensor = torch.tensor([feature_vector]).float()
        spikes = (torch.rand_like(features_tensor) < torch.sigmoid(features_tensor)).float()

        # Execute temporal LIF step
        self.lif_layer.reset_membrane()
        spike_votes = torch.zeros(1, 4)
        
        # Simulate 10 biological time steps
        for _ in range(10):
            fired = self.lif_layer(spikes)
            spike_votes += fired

        predicted_class_idx = torch.argmax(spike_votes, dim=1).item()
        pathogen = self.classes_labels[predicted_class_idx]
        confidence = float(torch.softmax(spike_votes, dim=1)[0, predicted_class_idx].item())

        alert = {
            "timestamp": time.time(),
            "pathogen_classified": pathogen,
            "confidence_score": round(confidence * 100, 2),
            "edge_resolved": not network_available
        }

        # If network backhaul is down, save alert locally to file buffer
        if not network_available:
            self._buffer_alert(alert)

        return alert

    def _buffer_alert(self, alert: dict):
        alerts = []
        if os.path.exists(self.outage_buffer_path):
            try:
                with open(self.outage_buffer_path, "r") as f:
                    alerts = json.load(f)
            except:
                pass
        
        alerts.append(alert)
        with open(self.outage_buffer_path, "w") as f:
            json.dump(alerts, f, indent=2)

    def flush_buffer(self) -> list:
        if not os.path.exists(self.outage_buffer_path):
            return []
        
        try:
            with open(self.outage_buffer_path, "r") as f:
                alerts = json.load(f)
            os.remove(self.outage_buffer_path)
            return alerts
        except:
            return []

if __name__ == "__main__":
    classifier = EdgeSNNClassifier()
    mock_features = [0.5] * 128
    res = classifier.classify_and_buffer(mock_features, network_available=False)
    print(f"SNN Edge Local Classification: {res['pathogen_classified']} with confidence: {res['confidence_score']}%")
    print(f"Flush Edge Outage Alerts: {classifier.flush_buffer()}")
