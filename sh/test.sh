# set -E

# trap 'echo "Errore in linea $LINENO, comando: $BASH_COMMAND"; exit 1' ERR

trap "echo aaaaa" DEBUG

ls .
# ls dir_inesistentee

trap "echo voleeevi" SIGINT SIGTERM

sleep 100
sleep 100


