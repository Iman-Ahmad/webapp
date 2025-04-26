import os
from typing import List

MODELS_DIR = "../models"  # Outside webapp but relative path works
EXCLUDED_MODELS = [".DS_Store", "README.md"]

def get_models() -> List[str]:
    models = [
        f for f in os.listdir(MODELS_DIR) 
        if f.endswith(('.h5', '.pkl')) 
        and f not in EXCLUDED_MODELS
    ]
    return sorted(models)

if __name__ == "__main__":
    print("Detected models:", get_models())