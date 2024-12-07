import torch
from transformers import BertTokenizer, BertForSequenceClassification
import json
import os

# Paths for the model and category mapping
MODEL_PATH = os.path.join(os.path.dirname(__file__), "saved_model")
CATEGORY_MAPPING_PATH = os.path.join(
    os.path.dirname(__file__), "category_mapping.json")

# Load model, tokenizer, and category mapping once
model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()  # Set model to evaluation mode

tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)

with open(CATEGORY_MAPPING_PATH, "r") as f:
    category_mapping = json.load(f)


def predict_category(text: str) -> str:
    """
    Predict the category of a given text using the pre-trained BERT model.
    Args:
        text (str): Input text to classify.
    Returns:
        str: Predicted category.
    """
    try:
        inputs = tokenizer(text, return_tensors="pt",
                           padding=True, truncation=True, max_length=512)
        with torch.no_grad():
            outputs = model(**inputs)
        predicted_id = torch.argmax(outputs.logits, dim=-1).item()
        return category_mapping.get(str(predicted_id), "Unknown")
    except Exception as e:
        raise ValueError(f"Error in prediction: {e}")
