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
    # with open(csv_path, "r") as file:
    #     data = file.readlines()  # Reads all lines

    df = pd.read_csv(csv_path)

    df_ss = (
        df.groupby(["Sleep Duration", "Stress Level"])
        .size()
        .reset_index(name="Occurrences")
    )

    df_dic = df_ss.to_dict()

    return JsonResponse({
            df_dic
            # "data": {
            #     "sleep_stress": {
            #         "stress": df_ss["Stress Level"],
            #         "sleep": df_ss["Sleep Duration"],
            #         "occurrences": df_ss["Occurrences"],
            #     }
            # }
        })  # Return dictionary
