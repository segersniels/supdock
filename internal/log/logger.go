package log

import (
	"log"
	"os"
)

var (
	DebugLogger *log.Logger
	InfoLogger  *log.Logger
	ErrorLogger *log.Logger
)

func init() {
	// Set up loggers with different prefixes
	InfoLogger = log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	ErrorLogger = log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)

	// Debug logging only enabled if SUPDOCK_DEBUG is set
	if os.Getenv("SUPDOCK_DEBUG") != "" {
		DebugLogger = log.New(os.Stdout, "DEBUG: ", log.Ldate|log.Ltime|log.Lshortfile)
	} else {
		// Discard debug logs by default
		DebugLogger = log.New(os.Stdout, "", 0)
		DebugLogger.SetOutput(os.Stdout) // Still keep it as stdout for consistency
	}
}

func Debug(v ...interface{}) {
	if os.Getenv("SUPDOCK_DEBUG") != "" {
		DebugLogger.Println(v...)
	}
}

func Info(v ...interface{}) {
	InfoLogger.Println(v...)
}

func Error(v ...interface{}) {
	ErrorLogger.Println(v...)
}
