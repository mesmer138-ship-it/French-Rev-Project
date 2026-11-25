# Model comparison results

## Main comparison (all features, seed-42 split)

The three strongest model families sit within 0.015 test AUC of each other (0.857 to 0.871), and the single tree is well behind; the multi-seed runs will show whether the top gap is real.

| Model | Tuning | Chosen settings | CV AUC | Test AUC | Multi-seed AUC | Test acc. |
| --- | --- | --- | --- | --- | --- | --- |
| Plain logistic | none (default C) | C = 1 | 0.774 ± 0.016 | 0.711 | 0.764 ± 0.028 | 0.670 |
| Engineered logistic | knots × C grid (4 × 5 = 20 combinations), then 20, 30 and 40 knots at C = 1; grouped 5-fold CV | 40 knots, default C = 1 | 0.873 ± 0.013 | 0.860 | 0.869 ± 0.020 | 0.789 |
| Decision tree, default | none | unlimited depth, class\_weight balanced; train AUC 0.9999 | 0.688 ± 0.025 | 0.712 | 0.694 ± 0.032 | 0.728 |
| Decision tree, depth 4 | depth 2 to 8 by grouped 5-fold CV (manual loop) | depth 4, class\_weight balanced; train AUC 0.836 | 0.793 ± 0.021 | 0.798 | 0.794 ± 0.032 | 0.712 |
| Random forest, default | none | library defaults, class\_weight balanced | 0.865 | 0.860 | 0.863 ± 0.014 | 0.781 |
| Random forest, grid-searched | 36-combination grid | max\_depth 16, min\_samples\_leaf 1, max\_features 0.3 (100 trees, class\_weight balanced) | 0.870 ± 0.008 (best of 36, slightly optimistic) | 0.862 | 0.863 ± 0.016 | 0.785 |
| XGBoost, default | none | library defaults | 0.878 | 0.857 | 0.862 ± 0.016 | 0.799 |
| XGBoost, Optuna | 50 trials | from final\_clf\_pca.joblib (scale\_pos\_weight 0.772), 98 trees | 0.878 (best of 50 trials, slightly optimistic) | 0.871 | 0.870 ± 0.018 | 0.799 |

## Feature ablation (test AUC, seed-42 split)

Date alone gives the depth-4 tree 0.790, well above text (0.625) or class (0.632) alone; the ensembles need all three feature groups to reach about 0.87.

| Model | Text only | Class only | Date only | Text + date | Text + class | Date + class | All |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Plain logistic | 0.702 | 0.578 | 0.531 | 0.704 | 0.709 | 0.582 | 0.711 |
| Engineered logistic | 0.702 | 0.634 | 0.784 | 0.850 | 0.734 | 0.808 | 0.860 |
| Decision tree, depth 4 | 0.625 | 0.632 | 0.790 | 0.798 | 0.636 | 0.796 | 0.798 |
| Random forest, default | 0.759 | 0.634 | 0.783 | 0.861 | 0.763 | 0.761 | 0.860 |
| XGBoost, default | 0.756 | 0.634 | 0.801 | 0.861 | 0.755 | 0.805 | 0.857 |
| XGBoost, Optuna | 0.752 | 0.634 | 0.802 | 0.865 | 0.751 | 0.816 | 0.871 |

Tree accuracy in the same runs: text only 0.616, class only 0.592, date only 0.746 (majority baseline 0.599). The XGBoost, default row uses library defaults in every cell, and the XGBoost, Optuna row uses the saved tuned model's settings, which were tuned with all three feature groups present; forest rows use library defaults plus class\_weight balanced. The earlier text-only XGBoost result with the Optuna model's settings (0.752) appears in the embeddings vs TF-IDF table below. Engineered logistic cells in this table use 40 knots, C = 1.

### Text representation: embeddings vs TF-IDF

All rows use default XGBoost with no separate tuning, except the TF-IDF row marked engineered logistic. With XGBoost, CamemBERT + PCA 50 beats TF-IDF on text alone (CV 0.763 vs 0.736, test 0.756 vs 0.717), but with a logistic model TF-IDF is ahead of the PCA features (CV 0.771 vs 0.760, test 0.723 vs 0.702), and the gap shrinks once date and class are added (CV 0.878 vs 0.863, test 0.857 vs 0.847). Raw 1,024-dimension embeddings are slightly behind PCA 50 in both settings. Paired with the engineered logistic instead of XGBoost, TF-IDF + date + class reaches CV 0.876 and test 0.859, level with CamemBERT PCA 50 + date + class (0.878 and 0.857), so the TF-IDF gap above partly reflects the model pairing. An earlier run with the Optuna-tuned XGBoost's settings (copied from final\_clf\_pca.joblib) had embeddings ahead on text alone by about 0.03 CV and 0.05 test AUC (test 0.752 vs 0.703), with the gap shrinking to 0.01 to 0.03 once date and class were added.

| Features | CV AUC | Test AUC |
| --- | --- | --- |
| CamemBERT + PCA 50, text only | 0.763 ± 0.016 | 0.756 |
| CamemBERT raw (1,024 dimensions), text only | 0.754 ± 0.020 | 0.731 |
| TF-IDF (2,000 terms, 1 to 2-grams, min\_df 3), text only | 0.736 ± 0.029 | 0.717 |
| TF-IDF, text only, logistic regression (C = 1) | 0.771 ± 0.028 | 0.723 |
| TF-IDF + date + class | 0.863 ± 0.014 | 0.847 |
| TF-IDF + date + class, engineered logistic (40 knots, C = 1) | 0.876 ± 0.015 | 0.859 |
| CamemBERT + PCA 50 + date + class | 0.878 | 0.857 |
| CamemBERT raw (1,024 dimensions) + date + class | 0.870 ± 0.013 | 0.853 |

## Forward-in-time test (test AUC)

Train on trials before 22 Prairial (day 626, 10 June 1794; 2,026 rows, 55% executed) and test from it onward (2,194 rows, 58% executed), on the 4,220 deduplicated rows, so no test row shares a period with training. This checks how much of the random-split score comes from date acting as a lookup. Default settings (engineered logistic: 40 knots, C = 1), random\_state 42, one cutoff.

| Model | All features | Text only | Text + class |
| --- | --- | --- | --- |
| XGBoost, default | 0.697 | 0.682 | 0.720 |
| XGBoost, Optuna | 0.719 | 0.695 | 0.719 |
| Random forest, default | 0.681 | 0.691 | 0.698 |
| Engineered logistic | 0.749 | 0.650 | 0.748 |
| TF-IDF + logistic | 0.736 | 0.692 | 0.733 |

Date only is not shown: it scores 0.500 for every model by construction, since all test dates fall after the training dates. Text + class is the realistic new-period score. The Optuna settings were tuned on all of train\_val, including trials after the cutoff, so that row is slightly optimistic. Single cutoff, so differences of a few hundredths between models are suggestive, not conclusive.
