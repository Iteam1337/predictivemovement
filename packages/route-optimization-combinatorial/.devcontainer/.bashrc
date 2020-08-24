# -------------------------------
# ENVIRONMENT CONFIGURATION
# -------------------------------

# colors
green="\[\e[0;32m\]"
nocolor="\[\e[m\]"
blue="\[\e[0;34m\]"
brown="\[\e[0;93m\]"
red="\[\e[0;31m\]"
cyan="\[\e[0;36m\]"

# set bash prompt
PS1="$red\$(errorStatus)$green\u $hostColour\h $blue\w$brown\$(branchStatus) $green\$$nocolor "

errorStatus() {
	test $? -ne 0 && echo "✘ "
}


# -------------------------------
# GIT
# -------------------------------

# returns an asterisk if current repo is dirty (has changed or untracked files)
isRepoDirty() {
	[[ -z $(git status --porcelain 2> /dev/null) ]] || echo "*"
}

# returns the active branch if called from git repository
activeBranch() {
	# git branch 2> /dev/null | sed -e '/^[^*]/d' -e "s/* \(.*\)/ [\1$(isRepoDirty)]/"
	# git branch 2> /dev/null | sed -e '/^[^*]/d' -e "s/* \(.*\)/\1/"

	git status 2> /dev/null \
		| head -n 1 \
		| sed -e "s/On branch \(.*.\)/\1/" \
		| sed -e "s/HEAD detached at \(.*\)/\1/g"
}

branchStatus() {
	test -n "$(activeBranch)" && echo " [$(activeBranch)$(isRepoDirty)]"
}

# -------------------------------
# MISC
# -------------------------------

# reduce unnecessary tab key presses
bind 'set show-all-if-ambiguous on'

# some pretty standard aliases
alias ls='ls'
alias ll='ls -lh'
alias la='ls -Alh'
alias cd..="cd .."
