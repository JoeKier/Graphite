import os
from django.conf import settings
from django.http import JsonResponse
import pandas as pd

def process_data_view(request):
    # Define the absolute path to the CSV file
    csv_path = os.path.join(settings.BASE_DIR, "gsite", "processed_data", "data", "Sleep.csv")

    # Check if the file exists before opening it
    if not os.path.exists(csv_path):
        return JsonResponse({"error": "Sleep.csv file not found"}, status=404)

    # Read the CSV file

    df = pd.read_csv(csv_path)
    df_num = df.fillna(0)    
    df_ss = (
        df_num.groupby(["Sleep Duration", "Stress Level"])
        .size()
        .reset_index(name="Occurrences")
    )

    #df_ss = df_ss.applymap(lambda x: x if isinstance(x, (int, float)) else None)

    data = {
        "data": {
            "sleep_stress": {
                "stress": df_ss["Stress Level"].tolist(),
                "sleep": df_ss["Sleep Duration"].tolist(),
                "occurrences": df_ss["Occurrences"].tolist(),
            }
        }
    }

    return JsonResponse(data)  # Return dictionary
