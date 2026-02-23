import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

print("Starting training...")

df = pd.read_csv("city_day.csv")

print("Dataset loaded:", df.shape)

# Keep required columns
df = df[["City", "PM2.5"]].dropna()

# Encode city names to numbers
le = LabelEncoder()
df["City_encoded"] = le.fit_transform(df["City"])

# Create lag features
df["lag1"] = df.groupby("City")["PM2.5"].shift(1)
df["lag2"] = df.groupby("City")["PM2.5"].shift(2)
df["lag3"] = df.groupby("City")["PM2.5"].shift(3)

df = df.dropna()

print("After lag creation:", df.shape)

X = df[["City_encoded", "lag1", "lag2", "lag3"]]
y = df["PM2.5"]

model = RandomForestRegressor()
model.fit(X, y)

# Save both model and encoder
joblib.dump(model, "model.pkl")
joblib.dump(le, "encoder.pkl")

print("✅ Multi-city model trained and saved.")