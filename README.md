Thermidor: Predicting Execution Outcomes at the Paris Revolutionary Tribunal

A model that scores how closely a charge, a date and a social class resemble cases that ended in execution at the Paris Revolutionary Tribunal (1792-1795), plus a pipeline that extracts accusations from parliamentary archives and scores them.

Live site: https://mesmer138-ship-it.github.io/French-Rev-Project/
Write-up: paper/

The score describes outcome patterns in the historical record. It is not a calibrated probability, and it is not a measure of guilt.

Results

All scores are ROC AUC. Test scores are on the 736 held-out trials (seed-42 split by cluster); CV is grouped 5-fold on the training data.

Model	CV AUC	Test AUC
Plain logistic regression	0.774 ± 0.016	0.711
Engineered logistic regression (40-knot date spline, C = 1)	0.873 ± 0.013	0.860
Decision tree (depth 4)	0.793 ± 0.021	0.798
Random forest (grid-searched)	0.870 ± 0.008	0.862
XGBoost (default)	0.878	0.857
XGBoost (Optuna, 50 trials)	0.878	0.871

The three strongest model families are within about 0.015 test AUC of each other, and split-to-split noise is about 0.015, so the gaps between them are small. I chose the engineered logistic regression on cross-validation performance and simplicity, not on its test score.

Which features matter (test AUC, engineered logistic regression)

Text only	Class only	Date only	Date + class	All features
0.702	0.634	0.784	0.808	0.860

Forward in time: train on trials before 22 Prairial (day 626, 10 June 1794) and test on later trials, so date cannot act as a lookup.

Model	All features	Text only	Text + class
Engineered logistic regression	0.749	0.650	0.748
XGBoost (Optuna)	0.719	0.695	0.719
Random forest	0.681	0.691	0.698
Date and class do most of the work on a random split, and the charge text lifts the score from about 0.81 to 0.86.
On later trials the date stops helping, and the score comes almost entirely from the charge text and class.
Full tables, tuning details and caveats are in the write-up in paper/.
Data
Step	Count
Charges recorded from Wallon's Histoire du tribunal révolutionnaire de Paris and archival finding aids	5,264
After removing near-duplicate charges (cosine similarity clustering)	4,220
Training	3,484
Held-out test	736

Near-duplicate charges shared by co-defendants can leak across a split, so splits are made by cluster.

Pipeline
Extract records from Wallon with Gemini-assisted OCR and extraction.
Embed each charge with CamemBERT (dangvantuan/sentence-camembert-large, 1,024 dimensions).
Reduce to 50 PCA components.
Score with logistic regression on a spline of the trial date, the PCA components and one-hot social class.
Explain each score with SHAP waterfalls grouped into charge text, date and class.
Showcase: accusations extracted from the Recueil des actes du Comité de salut public, the Parliamentary archives and Le Moniteur are condensed into French charges and scored for five historical figures.
Repository layout
notebooks/     embeddings and deduplication, model comparison, final model and SHAP
extraction/    Gemini extraction pipeline
cps/           parser for the Recueil des actes du Comité de salut public
docs/          the website (GitHub Pages)
paper/         the write-up
Reproducing
pip install -r requirements.txt

The saved models are only guaranteed to load under the library versions pinned in requirements.txt. To rerun the Gemini extraction as well, run pip install -r requirements-extraction.txt; it needs a Gemini API key.

Limitations
The model does worse on periods it has not seen (0.75 forward in time against 0.86 on a random split).
Scores reflect a political tribunal's records, not guilt.
AI assistance

I used Claude as an assistant for code, explanations and drafting the write-up. I made the project decisions and ran every analysis myself, and the reported numbers come from those runs.

