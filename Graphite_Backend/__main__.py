import pandas as pd
import uvicorn
from fastapi import FastAPI
from typing import List
from starlette.middleware.cors import CORSMiddleware

# Create FastAPI App --
App = FastAPI()

App.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# FastAPI route to fetch the processed data
@App.get("/process_data")
def get_processed_data():

    df = pd.read_csv("D:\Documents\Analiza\Trening\Dane\Sleep.csv")

    map = {
        "Yes": 1,
        "No": 0,
        "Female": 0,
        "Male": 1,
        "Low": 0,
        "Medium": 1,
        "High": 2,
        "Sleep Apnea": 1,
        "Insomnia": 2,
        "Normal Weight": 0,
        "Normal": 0,
        "Overweight": 1,
        "Obese": 2,
    }
    df_num = df.replace(map)
    df_num = df_num.fillna(0)
    df_num[["Systolic", "Diastolic"]] = df_num["Blood Pressure"].str.split(
        "/", expand=True
    )
    df_num = df_num.drop(columns=["Occupation", "Person ID", "Blood Pressure"])

    return {"data": list(zip(df_num["Stress Level"].tolist(), df_num["Sleep Duration"].tolist())), "histogram": 0}


if __name__ == "__main__":
    uvicorn.run(App, host="127.0.0.1", port=8000, ssl_keyfile="key.pem", ssl_certfile="cert.pem")
