# Helm charts

### Create a chart

- Generate a chart (we use `plot-routes` as the name for this example)
```bash
helm create plot-routes # change plot-routes to what you want to name the chart
```

- Delete the `tests` folder inside the `templates` of the newly generated chart (we don't need it)

- If you plan to use environment variables update the `deployment.yaml` and add the following to it (in the `spec.spec.containers` section on the same level as `ports`)

```yaml
env:
{{- range $key, $value := .Values.env }}
- name: {{ $key }}
  value: {{ $value }}
{{- end }}
```

- Remove the `livenessProbe` and `readinessProbe` from the `deployment.yaml` template file

- Change the `values.yaml` and set the following:

  - `image.repository` and `image.tag` to whatever you desire
  - `image.pullPolicy` to `Always`
  - `ingress.enabled` to `true`
  - `ingress.hosts.host` to whatever you desire (we set to `plot-routes.pm.iteamdev.se`)
  - `ingress.hosts.paths` change it from `[]` to contain `"/"`
  - `ingress.tls` change it from `[]` to contain:
  ```yaml
  - secretName: letsencrypt-prod
    hosts:
      - plot-routes.pm.iteamdev.se
  ```
  - add environment variables section:
  ```yaml
  env:
    ROUTE_API: http://match-route.default.svc.cluster.local
    OSRM: http://osrm.default.svc.cluster.local
  ```

- Your `values.yaml` should look similar to this:

```yaml
replicaCount: 1

image:
  repository: iteam1337/predictive-movement-plot-routes
  tag: latest
  pullPolicy: Always

imagePullSecrets: []
nameOverride: ""
fullnameOverride: ""

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  annotations: {}
  hosts:
    - host: plot-routes.pm.iteamdev.se
      paths:
      - "/"

  tls:
  - secretName: letsencrypt-prod
    hosts:
      - plot-routes.pm.iteamdev.se

env:
  ROUTE_API: http://match-route.default.svc.cluster.local
  OSRM: http://osrm.default.svc.cluster.local

resources: {}

nodeSelector: {}

tolerations: []

affinity: {}
```

- Render the template to see that everything works fine

```bash
helm template plot-routes --name plot-routes
```

- You can then apply your rendered Kubernetes resources

```bash
helm template plot-routes --name plot-routes | kubectl apply -f -
```
