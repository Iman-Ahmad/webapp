import os
from typing import List

# Переменные окружения
TARGET_CONFIGS = os.getenv("DEPLOY_CONFIGS", "").split(",")
EXCLUDED_CONFIGS = os.getenv("EXCLUDED_CONFIGS", ".gitkeep,README.md").split(",")

def get_deploy_configs() -> List[str]:
    """Возвращает список конфигураций для тестирования."""
    # Режим явного выбора
    if TARGET_CONFIGS and TARGET_CONFIGS[0]:
        return [c.strip() for c in TARGET_CONFIGS if c]
    
    # Автоматическое обнаружение
    configs_dir = os.path.join(os.path.dirname(__file__), "../../deployment")
    items = os.listdir(configs_dir)
    
    return sorted([
        item for item in items
        if item not in EXCLUDED_CONFIGS
        and not item.startswith(".")
        and (item.endswith(".yml") or item.endswith(".dockerfile"))
    ])

if __name__ == "__main__":
    print("Available configs:", get_deploy_configs())