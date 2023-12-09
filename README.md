# synthetic-monintoring
Verify synthetic monitor.

## Environment variable
```bash
export PROJECT_ID=sanbox-334000
export DISPLAY_NAME="sm-kaizen-e"
export REGION="us-central1"
export FUNC_NAME="kaizen-e"
export FUNCTION_NAME="projects/${PROJECT_ID}/locations/${REGION}/functions/${FUNC_NAME}"
export ACCESS_TOKEN=`gcloud auth print-access-token`

echo $PROJECT_ID
echo $DISPLAY_NAME
echo $REGION
echo $FUNC_NAME
echo $FUNCTION_NAME
echo $ACCESS_TOKEN
```

## Create a Function
### Notes
- Ensure that more memory is available.　`--memory`
- Set a longer timeout. `--timeout`
```bash
sudo gcloud functions deploy $FUNC_NAME \
  --gen2 --region=$REGION --source="." \
  --entry-point=CustomPuppeteerSynthetic --trigger-http --runtime=nodejs18 --project=$PROJECT_ID --memory=2G --timeout=60
```

## Create a synthetic monitor
```bash
sudo curl https://monitoring.googleapis.com/v3/projects/${PROJECT_ID}/uptimeCheckConfigs \
 -H "Authorization: Bearer ${ACCESS_TOKEN}" \
 -H "Content-Type: application/json" --request POST \
 --data '{ "displayName": "'"${DISPLAY_NAME}"'", "synthetic_monitor": {"cloud_function_v2": {"name": "'"${FUNCTION_NAME}"'"} },}'
```
