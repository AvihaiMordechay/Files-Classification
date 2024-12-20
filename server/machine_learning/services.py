import torch
from transformers import BertTokenizer, BertForSequenceClassification
import requests
from dotenv import load_dotenv
import json
import os

load_dotenv()

# Hugging Face model path
# השם של המאגר שלך ב-Hugging Face
MODEL_ID = os.getenv("HUGGING_FACE_MODEL_ID")

# Set Hugging Face API Token
API_TOKEN = os.getenv("HUGGING_FACE_API_TOKEN")

# Load model and tokenizer from Hugging Face Hub with API token
try:
    # Load model and tokenizer
    model = BertForSequenceClassification.from_pretrained(
        MODEL_ID, token=API_TOKEN)
    model.eval()  # Set model to evaluation mode
    tokenizer = BertTokenizer.from_pretrained(MODEL_ID, token=API_TOKEN)
    # Fetch the category mapping file from Hugging Face
    CATEGORY_MAPPING_URL = f"https://huggingface.co/{MODEL_ID}/resolve/main/category_mapping.json"
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    response = requests.get(CATEGORY_MAPPING_URL, headers=headers)
    response.raise_for_status()
    category_mapping = response.json()
except Exception as e:
    raise ValueError(
        f"Failed to load model, tokenizer, or category mapping: {e}")


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
        predicted_id = torch.argmax(outputs.logits, dim=-1).item()
        return category_mapping.get(str(predicted_id), "Unknown")
    except Exception as e:
        raise ValueError(f"Error in prediction: {e}")
