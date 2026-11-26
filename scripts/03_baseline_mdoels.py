# Baseline models on date and social class only (no charge text).
# 1. Plain logistic regression 2. Decision Tree (depth 4)
# Both are scored with 5-fold cross validation grouped by cluster_id, then once on the held-out test set.
# Expected: logistic regression CV AUC 0.612, test AUC 0.582; decision tree CV AUC 0.790, test AUC 0.796.

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import GroupKFold
from sklearn.metrics import roc_auc_score, accuracy_score

DRIVE = 'data'
tv = pd.read_csv(f'{DRIVE}/pca_train_val.csv')       # train + validation rows
te = pd.read_csv(f'{DRIVE}/pca_held_out_test.csv')   # held out test rows
y_train = tv['target']
y_test = te['target']
groups = tv['cluster_id']

#-------Plain Logistic Regression-------------
feature_cols = ['encoded_social_class','date_numeric']
X_train = tv[feature_cols]
X_test = te[feature_cols]

cv = list(GroupKFold(n_splits=5).split(X_train,y_train,groups=groups))
fold_aucs = []
for train_idx,val_idx in cv:
  X_tr,X_va = X_train.iloc[train_idx], X_train.iloc[val_idx]
  y_tr, y_va = y_train.iloc[train_idx], y_train.iloc[val_idx]
  scaler = StandardScaler()
  X_tr_scaled = scaler.fit_transform(X_tr)
  X_val_scaled = scaler.transform(X_va)
  model = LogisticRegression(max_iter=1000)
  model.fit(X_tr_scaled, y_tr)
  preds = model.predict_proba(X_val_scaled)[:,1]
  fold_aucs.append(roc_auc_score(y_va,preds))
print(f"mean:{np.mean(fold_aucs)},std;{np.std(fold_aucs)}")

scaler = StandardScaler()
