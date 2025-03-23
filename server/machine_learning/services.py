import torch
from transformers import BertTokenizer, BertForSequenceClassification
import json
import os

# Paths for the model and category mapping
MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_model")
CATEGORY_MAPPING_FILE = os.path.join(MODEL_DIR, "category_mapping.json")

# Load model, tokenizer, and category mapping
try:
    model = BertForSequenceClassification.from_pretrained(MODEL_DIR)
    model.eval()  # Set model to evaluation mode
    tokenizer = BertTokenizer.from_pretrained(MODEL_DIR)

    with open(CATEGORY_MAPPING_FILE, "r") as f:
        category_mapping = json.load(f)
except Exception as e:
    raise ValueError(f"Failed to load model or mapping: {e}")


def predict_category(text: str) -> str:
    """
    Predict the category of a given text using the pre-trained BERT model.

    Args:
        text (str): Input text to classify.

    Returns:
        str: Predicted category or "Unknown".
    """
    try:
        inputs = tokenizer(
            text,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=512
        )
        with torch.no_grad():
            outputs = model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=-1).squeeze()
        
        #using a threshold of 0.4 to return undefined if the max probability is less than 0.4
    
        if torch.max(probabilities).item() < 0.4:
            return "undefined"
        
        predicted_id = torch.argmax(outputs.logits, dim=-1).item()
        return category_mapping.get(str(predicted_id), "Unknown")
    except Exception as e:
        raise ValueError(f"Error in prediction: {e}")
