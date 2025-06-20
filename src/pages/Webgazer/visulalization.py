import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# ✅ 1. CSV 파일 경로를 입력하세요
csv_path = r'C:\Users\dmswl\OneDrive\바탕 화면\Kiosk-v1\public\2025-06-08_09_49_41_v6_정면.csv'


# ✅ 2. CSV 로드
df = pd.read_csv(csv_path)

# ✅ 3. 오차(distance) 계산
df['error'] = np.sqrt((df['pred_X'] - df['target_X'])**2 + (df['pred_Y'] - df['target_Y'])**2)

# ✅ 4. 시각화
plt.figure(figsize=(18, 12))

# 1. Target vs Prediction 산점도
plt.subplot(2, 2, 1)
plt.scatter(df['target_X'], df['target_Y'], label='Target', alpha=0.6)
plt.scatter(df['pred_X'], df['pred_Y'], label='Prediction', alpha=0.6)
plt.title('Target vs Prediction (Scatter)')
plt.xlabel('X')
plt.ylabel('Y')
plt.legend()
plt.grid(True)
plt.gca().invert_yaxis() 

# 2. Segment별 평균 오차 바 차트
plt.subplot(2, 2, 2)
segment_error = df.groupby('segmentIndex')['error'].mean().reset_index()
plt.bar(segment_error['segmentIndex'], segment_error['error'], color='orange')
plt.title('Average Prediction Error per Segment')
plt.xlabel('Segment Index')
plt.ylabel('Average Error (pixels)')
plt.grid(True)

# 3. Latency 히스토그램
plt.subplot(2, 2, 3)
plt.hist(df['latency'], bins=30, color='skyblue', edgecolor='black')
plt.title('Latency Distribution')
plt.xlabel('Latency (ms)')
plt.ylabel('Frequency')
plt.grid(True)

# 4. Segment별 Latency Boxplot
plt.subplot(2, 2, 4)
sns.boxplot(x='segmentIndex', y='latency', data=df, palette='Set2')
plt.title('Latency by Segment')
plt.xlabel('Segment Index')
plt.ylabel('Latency (ms)')

plt.tight_layout()
plt.show()
