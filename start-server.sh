
#!/bin/bash
# Kill all existing node processes
pkill -f node || true
# Start the server with explicit host and port binding
npm run dev -- --host 0.0.0.0 --port 3300 --strictPort=false
