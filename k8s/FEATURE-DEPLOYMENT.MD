## Requirements before you start

- Are familiar with Kubernetes, Helm charts and Travis
- Have followed the `README`

## Setup

- There are `helm charts` created for map and match-route.
- Travis is configured to build and deploy pull requests

### Build process

- The script is located in `bin/build-feature.sh`
- It takes the github branch name, replaces some special characters with `-` and uses that as the Docker tag;
- It build the Dockerfile, tags it and pushes it to Dockerhub

### Deploy process

- The script is located in `bin/deploy-feature.sh`
- It downloads `kubectl` and `helm`
- It takes the github branch name, replaces some special characters with `-` and uses that as the feature name or [Kubernetes namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)
- Depending on the `package` that this applies to (`map` or `match-route`) it picks the associated chart and uses `helm template` to render the template while applying certain values different to the default ones declared in the chart's `values.yaml`
    * docker image tag to the one created in the Build process
    * ingress host in the format `<package name>-<formatted feature name>.pm.iteamdev.se`
- It pipes to `kubectl apply` and creates or configures resources in a new namespace (the formatted feature name by replacing special characters of the branch name)
- Charts come with a namespace template so that is how a new namespace where this resources can be applied is created
- It copies the google and mapbox token secrets from the default namespace to the new namespace that we use
- It checks if there is a pod for this package name and it's running, then it performs a rolling update by restartin the deployment (this would be the case when you commit to an existing PR and want your changes being deployed)
- It checks that there isn't a pod in a Running phase (which would be the case of the first time this runs for a new PR) and posts a comment to the PR in github with a link to the feature

### TODO
- Find a way to automate the teardown of the new namespace when a PR is merged or closed. <br>
  Right now this is a manual process that involves you doing:

  ```bash
  kubectl get namespaces
  kubectl delete namespace <your feature namespace>
  ```

- Make it so that the `map` can point to a different `match-route` associated with the same feature. <br>
  The use case for this would be when you have a feature where you make changes both in the backend and frontend.

- Restrict to maybe only `feat` and `feature`, `fix` branches?