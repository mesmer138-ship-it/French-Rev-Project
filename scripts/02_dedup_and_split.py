# Dedup and split: removes repeated rows, then holds out about 20% of the clusters as a test set.
# Reads wallon_archives.csv(made by 01_embedding_and_pca.py) and writes pca_train_val.csv
# (3,484 rows) and pca_held_out_test.csv(736 rows). This file documents how the split was made.
# rerunning it would overwrite the two split files every model was trained/tested on.

import pandas as pd
from sklearn.model_selection import GroupShuffleSplit

DRIVE = 'data'

# One row per repeated charge: a row is dropped only if another row has the same cluster, 
# trial date, outcome and social class. Otherwise near-duplicate charges would inflate AUC.
df_filtered = pd.read_csv(f'{DRIVE}/wallon_archives.csv')
df_filtered = df_filtered.drop_duplicates(subset=['cluster_id','date_numeric','target','encoded_social_class'],keep='first').reset_index(drop=True)

# Carve off the 20% held-out test set before any tuning
# Splitting by cluster_id keeps every charge from the same cluster on the same side,
# so no charge from one cluster crosses the split.
gss = GroupShuffleSplit(n_splits=1,test_size=0.2,random_state=42)
# gss.split yields the train and test row positions; next() takes the single split
# Test is ~20% of clusters, so no cluster has rows on both sides.
train_val_idx, test_idx = next(gss.split(df_filtered, groups=df_filtered['cluster_id']))

train_val = df_filtered.iloc[train_val_idx].reset_index(drop=True)
test = df_filtered.iloc[test_idx].reset_index(drop=True)
print(f"train_val rows: {len(train_val)}, test rows: {len(test)}")

# Save the held-out test so every later step reuses the same untouched 20%
test.to_csv(f'{DRIVE}/pca_held_out_test.csv',index=False)
train_val.to_csv(f'{DRIVE}/pca_train_val.csv',index=False)

