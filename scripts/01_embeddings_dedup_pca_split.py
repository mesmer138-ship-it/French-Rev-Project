# Embedding Block: takes the stored Camembert embeddings and clusters near duplicate charges into cluster_id and reduces
# the embeddings to 50 pca components. 

import joblib
import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import connected_components
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

#Get Dataframe
DRIVE = 'data'
df_cam = pd.read_csv(f'{DRIVE}/wallon_cleaned_charges_v5.csv',low_memory=False)

#Embed charges with Camembert(previous step)
#------------------------------------------

#camembert = SentenceTransformer("dangvantuan/sentence-camembert-large")
#charge_texts = df_cam['cleaned_charge'].fillna('inconnu').tolist()
#cam_embeddings = camembert.encode(charge_texts, batch_size=32, show_progress_bar=True, normalize_embeddings=True)
#emb_df = pd.DataFrame(cam_embeddings,columns=[f'cam_emb_{i}' for i in range(1024)],index=df_cam.index)
#df_cam = pd.concat([df_cam,emb_df],axis=1)
#df_cam.to_csv(f'{DRIVE}/wallon_cleaned_charges_v5.csv',index=False)

#-------------------------------------------


#cluster duplicate charges using cosine similarity
cam_cols = [f'cam_emb_{i}' for i in range(1024)]
cam_embeddings = df_cam[cam_cols].values
sim_matrix = cosine_similarity(cam_embeddings)
threshold = 0.95

#new matrix, adj, with 1s and 0s
adj = (sim_matrix >= threshold).astype(int)
# sets the same charges to zero
np.fill_diagonal(adj,0)
n_components,labels = connected_components(csr_matrix(adj),directed=False,return_labels=True)
df_cam['cluster_id'] = labels
df_cam.to_csv(f'{DRIVE}/wallon_cleaned_charges_v5.csv', index=False)

#transform to pca 50 components
pca = PCA(n_components=50,random_state=42)
pca = pca.fit(cam_embeddings)
X_pca = pca.transform(cam_embeddings)
joblib.dump(pca, f'{DRIVE}/fitted_pca.joblib')
#drop raw camembert columns and replace with pca
df = df_cam.drop(columns=cam_cols)
#concatenate pca columns to dataframe
pca_df = pd.DataFrame(X_pca,columns=[f'pca_{i}' for i in range(X_pca.shape[1])],index=df.index)
df = pd.concat([df,pca_df],axis=1)
#pd to csv file here, index=False
df.to_csv(f'{DRIVE}/wallon_archives.csv', index=False)







