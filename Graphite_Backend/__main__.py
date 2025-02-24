import pandas as pd
import uvicorn
from typing import List
from starlette.middleware.cors import CORSMiddleware

# FastAPI route to fetch the processed data
App.get("/process_data")
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
    df_ss = df_num.groupby(['Sleep Duration', 'Stress Level']).size().reset_index(name='Occurrences')

    return {
        "data": {
            "sleep_stress": {
                "stress": df_ss['Stress Level'],
                "sleep": df_ss['Sleep Duration'],
                "occurrences": df_ss['Occurrences'],
            } 

        }
    }
    #return {"data": list(zip(df_num["Stress Level"].tolist(), df_num["Sleep Duration"].tolist())), "histogram": 0}


if __name__ == "__main__":
    uvicorn.run(App, host="127.0.0.1", port=8000, ssl_keyfile="key.pem", ssl_certfile="cert.pem")
