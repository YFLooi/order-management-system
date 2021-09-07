DEV_CLUSTER="gke-my-deployment-cluster"
kubectl delete service operations-portal-service --namespace=dev --cluster=${DEV_CLUSTER}
kubectl delete deployment operations-portal-deployment --namespace=dev --cluster=${DEV_CLUSTER}
kubectl apply -f ./deployment/k8s/dev/deployment-dev.yaml --namespace=dev --cluster=${DEV_CLUSTER}
