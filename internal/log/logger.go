package log

import (
	"log"
	"os"
)

var debugLogger = log.New(os.Stdout, "DEBUG: ", log.Ldate|log.Ltime|log.Lshortfile)

func Debug(v ...interface{}) {
	if os.Getenv("DEBUG") != "" {
		debugLogger.Println(v...)
	}
}
