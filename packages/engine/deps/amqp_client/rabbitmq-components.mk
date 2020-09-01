ifeq ($(.DEFAULT_GOAL),)
# Define default goal to `all` because this file defines some targets
# before the inclusion of erlang.mk leading to the wrong target becoming
# the default.
.DEFAULT_GOAL = all
endif

# PROJECT_VERSION defaults to:
#   1. the version exported by rabbitmq-server-release;
#   2. the version stored in `git-revisions.txt`, if it exists;
#   3. a version based on git-describe(1), if it is a Git clone;
#   4. 0.0.0

PROJECT_VERSION := $(RABBITMQ_VERSION)

ifeq ($(PROJECT_VERSION),)
PROJECT_VERSION := $(shell \
if test -f git-revisions.txt; then \
	head -n1 git-revisions.txt | \
	awk '{print $$$(words $(PROJECT_DESCRIPTION) version);}'; \
else \
	(git describe --dirty --abbrev=7 --tags --always --first-parent \
	 2>/dev/null || echo rabbitmq_v0_0_0) | \
	sed -e 's/^rabbitmq_v//' -e 's/^v//' -e 's/_/./g' -e 's/-/+/' \
	 -e 's/-/./g'; \
fi)
endif

# --------------------------------------------------------------------
# RabbitMQ components.
# --------------------------------------------------------------------

dep_amqp_client                       = hex $(PROJECT_VERSION)
dep_rabbit_common                     = hex $(PROJECT_VERSION)

# Third-party dependencies version pinning.
dep_accept = hex 0.3.5
dep_cowboy = hex 2.6.1
dep_cowlib = hex 2.7.0
dep_jsx = hex 2.9.0
dep_lager = hex 3.8.0
dep_prometheus = hex 4.5.0
dep_ra = hex 1.0.8
dep_ranch = hex 1.7.1
dep_recon = hex 2.5.0
dep_observer_cli = hex 1.5.3
dep_stdout_formatter = hex 0.2.2
dep_sysmon_handler = hex 1.2.0
