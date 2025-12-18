# @acme/mcp

MCP (Model Context Protocol) handler package for the Next.js application.

## Overview

This package provides an MCP server implementation that enables AI assistants (Claude Desktop, Cursor, etc) to perform arithmetic operations via the MCP protocol.

## Features

- **MCP streaming endpoint**: MCP server using `mcp-handler` to stream responses via Server-Sent Events (SSE)

- **Arithmetic Tools**: Four example MCP tools for performing basic arithmetic operations:
  - `add`, `subtract`, `multiply`, `divide`

- **SSE Resumability**: Optional Redis support for resumable Server-Sent Events (SSE) streams

## SSE Resumability with Redis

- If a serverless function times out or the connection drops mid-stream, Redis stores the last position
- A new function invocation can read from Redis and resume the stream from where it left off
- Without Redis, streams still work but cannot resume after interruptions - they must restart from the beginning

To enable Redis, set the `REDIS_URL` environment variable. The handler will automatically use it if provided.

## Integrating with AI Assistants

To use this MCP server with AI assistants like Claude Desktop or Cursor, configure it using the appropriate settings file.
Cursor: ~/.cursor/mcp.json
Claude Desktop: ~/Library/Application Support/Claude/claude_desktop_config.json

### Configuration

Update your `mcp.json` file to include your service name and URL. You can also pass environment variables to the MCP server.

```json
{
  "mcpServers": {
    "acme-service": {
      "url": "http://localhost:3000/api/mcp",
      "env": {
        "REDIS_URL": "${REDIS_URL}" //Optional: enables SSE resumability
      }
    }
  }
}
```

You might need to restart your AI assistant to load the new MCP server configuration.

## Dependencies

- Uses `zod` v3 (`^3.23.8`) for compatibility with `mcp-handler`
- The rest of the monorepo uses `zod` v4, so this package isolates the dependency to prevent conflicts
