# התקנת חבילות נדרשות אם לא התקנת
# !pip install transformers datasets torch sklearn pandas

import pandas as pd
from sklearn.model_selection import train_test_split
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset
import torch

# 1. טעינת קובץ CSV
# נניח שהקובץ שלך נקרא 'data.csv' ויש בו שתי עמודות: 'category' ו-'text'
df = pd.read_csv('assets/data.csv')

# 2. חלוקה לקטגוריות (מספרי קטגוריות)
# אם אין לך קטגוריות מספריות, נוכל להמיר את העמודה 'category' לקטגוריות מספריות
df['category'] = df['category'].astype('category').cat.codes

# 3. חלוקה לסטים של אימון והערכה
train_texts, val_texts, train_labels, val_labels = train_test_split(
    df['text'].tolist(),
    df['category'].tolist(),
    test_size=0.2
)

# 4. טעינת המילון של BERT (Tokenizer)
tokenizer = BertTokenizer.from_pretrained('bert-base-multilingual-cased')


# 5. המרת הטקסטים לפורמט שמתאים ל-BERT (Tokenization)
def tokenize_function(texts):
    return tokenizer(texts, padding=True, truncation=True, max_length=512)


train_encodings = tokenizer(train_texts, padding=True, truncation=True, max_length=512)
val_encodings = tokenizer(val_texts, padding=True, truncation=True, max_length=512)

# 6. יצירת מחלקת Dataset
train_dataset = Dataset.from_dict(
    {'input_ids': train_encodings['input_ids'], 'attention_mask': train_encodings['attention_mask'],
     'labels': train_labels})
val_dataset = Dataset.from_dict(
    {'input_ids': val_encodings['input_ids'], 'attention_mask': val_encodings['attention_mask'], 'labels': val_labels})

# 7. יצירת המודל (מודל סיווג טקסטים מבית BERT)
model = BertForSequenceClassification.from_pretrained('bert-base-multilingual-cased',
                                                      num_labels=len(df['category'].unique()))

# 8. הגדרת פרמטרי האימון
training_args = TrainingArguments(
    output_dir='./results',  # מקום לשמירת תוצאות
    evaluation_strategy="epoch",  # הערכה אחרי כל אפוך
    learning_rate=2e-5,  # קצב הלמידה
    per_device_train_batch_size=8,  # גודל המיני-באטצ'ים באימון
    per_device_eval_batch_size=8,  # גודל המיני-באטצ'ים בהערכה
    num_train_epochs=3,  # מספר האפוכים
    weight_decay=0.01,  # ירידת משקל
)

# 9. יצירת אובייקט Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)

# 10. התחלת האימון
trainer.train()

# 11. הערכת המודל
results = trainer.evaluate()
print(results)


# 12. שימוש במודל המאומן לסיווג טקסטים חדשים
def predict(texts):
    # המרת הטקסטים לפורמט שמתאים למודל
    inputs = tokenizer(texts, return_tensors="pt", padding=True, truncation=True, max_length=512)
    # חיזוי הקטגוריה
    with torch.no_grad():
        outputs = model(**inputs)
    predictions = torch.argmax(outputs.logits, dim=-1)
    return predictions


# דוגמה לשימוש
texts_to_predict = ["הטקסט שאני רוצה לסווג"]
predictions = predict(texts_to_predict)
print(predictions)  # התוצאה היא קטגוריה (מספר)


