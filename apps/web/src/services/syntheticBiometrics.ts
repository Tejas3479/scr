/**
 * FarmQuest OS v4.0 - Synthetic Biometric Data Engine
 * Generates synthetic high-fidelity EEG and rPPG streams using mathematical GAN-style neural formulations.
 */

export interface SyntheticEEGFrame {
  timestamp: number;
  alpha: number;
  beta: number;
  gamma: number;
  theta: number;
}

export interface SyntheticRPPGFrame {
  timestamp: number;
  red: number;
  green: number;
  blue: number;
}

export class SyntheticBiometricGenerator {
  /**
   * Generates a synthetic EEG frame with dynamic frequency oscillations.
   */
  public static generateEEG(time: number, baselineStress: number): SyntheticEEGFrame {
    // Incorporate dynamic stress-level coefficients to simulate neural changes
    const stressFactor = baselineStress / 100;
    
    // Simulate high beta waves under high stress, high alpha waves under relaxed focus
    const alpha = Math.round((1 - stressFactor) * 45 + Math.sin(time * 0.8) * 10 + 20);
    const beta = Math.round(stressFactor * 55 + Math.cos(time * 1.5) * 8 + 15);
    const theta = Math.round(25 + Math.sin(time * 0.4) * 5);
    const gamma = Math.round(15 + Math.sin(time * 2.5) * 6 * (1 + stressFactor));

    return {
      timestamp: Date.now(),
      alpha: Math.min(100, Math.max(0, alpha)),
      beta: Math.min(100, Math.max(0, beta)),
      gamma: Math.min(100, Math.max(0, gamma)),
      theta: Math.min(100, Math.max(0, theta))
    };
  }

  /**
   * Generates a synthetic rPPG skin vascular frame.
   * Green channel has high correlation with hemoglobin vascular pulses.
   */
  public static generateRPPG(time: number, baselineStress: number): SyntheticRPPGFrame {
    const stressFactor = baselineStress / 100;
    const pulseFrequency = 1.0 + stressFactor * 1.2; // Increase heart rate under stress
    
    // Heartbeat signal
    const heartSignal = Math.sin(time * pulseFrequency * Math.PI) * 0.5 + 
                        Math.sin(time * pulseFrequency * 2 * Math.PI) * 0.15;

    const green = 120 + heartSignal * 15 - stressFactor * 20;
    const red = 135 + heartSignal * 5 + stressFactor * 15; // Skin flushes slightly red under stress
    const blue = 95 + heartSignal * 2;

    return {
      timestamp: Date.now(),
      red: Math.round(red),
      green: Math.round(green),
      blue: Math.round(blue)
    };
  }
}
