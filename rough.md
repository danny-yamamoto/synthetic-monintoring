sudo gcloud functions deploy kaizen-1 \
  --gen2 --region="us-west2" --source="." \
  --entry-point=SyntheticFunction --trigger-http --runtime=nodejs18 --project=sanbox-334000


export PROJECT_ID=sanbox-334000
export DISPLAY_NAME=sm-kaizen-1
export FUNCTION_NAME=projects/sanbox-334000/locations/us-west2/functions/kaizen-1

echo $PROJECT_ID
echo $DISPLAY_NAME
echo $FUNCTION_NAME

gcloud auth login
export ACCESS_TOKEN=`gcloud auth print-access-token`
echo $ACCESS_TOKEN

curl https://monitoring.googleapis.com/v3/projects/${PROJECT_ID}/uptimeCheckConfigs \
 -H "Authorization: Bearer ${ACCESS_TOKEN}" \
 -H "Content-Type: application/json" --request POST \
 --data '{ "displayName": "'"${DISPLAY_NAME}"'", "synthetic_monitor": {"cloud_function_v2": {"name": "'"${FUNCTION_NAME}"'"} },}'
