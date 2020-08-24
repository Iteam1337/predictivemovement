FROM mcr.microsoft.com/vscode/devcontainers/python:3.8

ENV PYTHONPATH="/workspace/src:/workspace/tests"

# customize bash
COPY .bashrc /root/.bashrc

# requirements
COPY requirements-src.txt /tmp/pip-tmp/requirements-src.txt
RUN pip3 --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements-src.txt \
    && rm -rf /tmp/pip-tmp

# requirements for test
COPY requirements-tests.txt /tmp/pip-tmp/requirements-tests.txt
RUN pip3 --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements-tests.txt \
    && rm -rf /tmp/pip-tmp

# requirements for visual studio code
COPY requirements-vscode.txt /tmp/pip-tmp/requirements-vscode.txt
RUN pip3 --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements-vscode.txt \
    && rm -rf /tmp/pip-tmp

CMD while sleep 1000; do :; done
