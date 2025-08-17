#!/bin/bash
echo "Integration test........."

aws --version

# Get EC2 instance details
Data=$(aws ec2 describe-instances)
echo "Data = $Data"

# Extract instance URL (public DNS or IP depending on tag dev-deploy)
URL=$(aws ec2 describe-instances | jq -r '.Reservations[].Instances[] | select(.Tags[].Value == "Jenkins_CD") | .PublicDnsName')
echo "URL Data = $URL"

if [[ "$URL" != '' ]]; then
    http_code=$(curl -s -o /dev/null -w "%{http_code}" http://$URL:3000/live)
    echo "http_code = $http_code"

    planet_data=$(curl -s -XPOST http://$URL:3000/planet -H "Content-Type: application/json" -d '{"id": "3"}')
    echo "planet_data = $planet_data"

    planet_name=$(echo $planet_data | jq .name -r)
    echo "planet_name = $planet_name"

    if [[ "$http_code" -eq 200 && "$planet_name" == "Earth" ]]; then
        echo "HTTP Status Code and Planet Name Tests Passed"
    else
        echo "One or more test(s) failed"
        exit 1
    fi
fi
