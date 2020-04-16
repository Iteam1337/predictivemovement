FROM jupyter/minimal-notebook:dc9744740e12
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt \
    && jupyter contrib nbextension install --user