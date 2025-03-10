from django.http import JsonResponse
import pandas as pd


def get_processed_data(request):

    df = pd.read_csv(".\Sleep.csv")

    df_ss = (
        df.groupby(["Sleep Duration", "Stress Level"])
        .size()
        .reset_index(name="Occurrences")
    )

    return JsonResponse(
        {
            "data": {
                "sleep_stress": {
                    "stress": df_ss["Stress Level"],
                    "sleep": df_ss["Sleep Duration"],
                    "occurrences": df_ss["Occurrences"],
                }
            }
        }
    )
