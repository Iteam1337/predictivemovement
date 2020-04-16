# Route Evaluation

AI/Machine learning is the core of the Predictive Movement platform. Various transportation environments (like a passenger-, package- or food-transport by bus, truck or car in rural or city areas) have different requirements to algorithms for optimized transportation. To address this, we are running an integrated "Route Evaluation" beside the Predictive Movement platform, which is specialized for the analyses of transportation data. Solutions for the "Traveling Salesman's Pick-up and Delivery Problem" or "Data-Driven Transportation Forecasting" are developed and evaluated in this project here. The target is to find and to optimize solutions for such routing problems for the Predictive Movement platform.

## Report

The work and results of the evaluation are documented in Jupyter Notebook. You can access these notebooks by starting a local Jupyter Notebook server in your Docker environment. It is planned to give read access to the notebooks without any needed setup, probably by nbviewer, GitHub or similar.

### How to start Jupyter Notebook locally

You can run the Jupyter Notebook server by its [docker-compose](report/docker-compose.yml).

In general, Jupyter secures access by a randomly generated token. For this setup, I replaced the automatic token generation by a static token. Therefore Jupyter is reachable at this URL: [http://127.0.0.1:58881/?token=f664b7779b19772730b6ff47509056a089e69304fa182ee6]

It is possible to override the static token by defining your own token in the system environment variable `PM_JUPYTER_TOKEN`.
