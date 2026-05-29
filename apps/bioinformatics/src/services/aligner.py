class SequenceAligner:
    def __init__(self, match_score=2, mismatch_penalty=-1, gap_penalty=-2):
        self.match = match_score
        self.mismatch = mismatch_penalty
        self.gap = gap_penalty

    def align(self, seq1: str, seq2: str):
        """
        Executes a Needleman-Wunsch global sequence alignment over seq1 and seq2.
        Returns the score, the aligned sequences with traceback maps, and match percentage.
        """
        m, n = len(seq1), len(seq2)
        if m == 0 or n == 0:
            return 0, "", "", 0.0

        # 1. Initialize Dynamic Programming Grid & Traceback Matrix
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        trace = [[0] * (n + 1) for _ in range(m + 1)]

        for i in range(m + 1):
            dp[i][0] = i * self.gap
            trace[i][0] = 1  # Up
        for j in range(n + 1):
            dp[0][j] = j * self.gap
            trace[0][j] = 2  # Left

        # 2. Populate Matrix
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                match_val = self.match if seq1[i-1] == seq2[j-1] else self.mismatch
                score_diag = dp[i-1][j-1] + match_val
                score_up = dp[i-1][j] + self.gap
                score_left = dp[i][j-1] + self.gap

                best_score = max(score_diag, score_up, score_left)
                dp[i][j] = best_score

                if best_score == score_diag:
                    trace[i][j] = 3  # Diagonal
                elif best_score == score_up:
                    trace[i][j] = 1  # Up
                else:
                    trace[i][j] = 2  # Left

        # 3. Traceback Path to reconstruct aligned sequences
        aligned_seq1 = []
        aligned_seq2 = []
        matches = 0
        total_slots = 0

        i, j = m, n
        while i > 0 or j > 0:
            total_slots += 1
            if i > 0 and j > 0 and trace[i][j] == 3:
                aligned_seq1.append(seq1[i-1])
                aligned_seq2.append(seq2[j-1])
                if seq1[i-1] == seq2[j-1]:
                    matches += 1
                i -= 1
                j -= 1
            elif i > 0 and (j == 0 or trace[i][j] == 1):
                aligned_seq1.append(seq1[i-1])
                aligned_seq2.append('-')
                i -= 1
            else:
                aligned_seq1.append('-')
                aligned_seq2.append(seq2[j-1])
                j -= 1

        aligned_seq1.reverse()
        aligned_seq2.reverse()

        alignment_score = dp[m][n]
        match_percentage = (matches / max(m, n)) * 100

        # Construct visual alignment map
        visual_map = []
        for a, b in zip(aligned_seq1, aligned_seq2):
            if a == b:
                visual_map.append("|")
            elif a == '-' or b == '-':
                visual_map.append(" ")
            else:
                visual_map.append(".")
        
        visual_str = "".join(visual_map)
        
        return {
            "score": alignment_score,
            "seq1_aligned": "".join(aligned_seq1),
            "seq2_aligned": "".join(aligned_seq2),
            "visual_alignment": visual_str,
            "match_percentage": round(match_percentage, 2)
        }

# Verify SequenceAligner
if __name__ == "__main__":
    aligner = SequenceAligner()
    result = aligner.align("ATGCGTCGAT", "ATGCGT-GAT")
    print(f"Alignment Score: {result['score']}")
    print(f"Aligned Seq 1:   {result['seq1_aligned']}")
    print(f"Alignment Match: {result['visual_alignment']}")
    print(f"Aligned Seq 2:   {result['seq2_aligned']}")
    print(f"Match Ratio:     {result['match_percentage']}%")
