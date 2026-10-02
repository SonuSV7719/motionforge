/**
 * MotionForge — MCP Server (Optional)
 *
 * Thin wrapper that exposes CLI commands as MCP tools.
 * This is an OPTIONAL layer — Skills + CLI is the primary agent interface.
 *
 * Usage: mf mcp-serve (starts the MCP server)
 */

// TODO: Implement MCP server using @modelcontextprotocol/sdk
// Each MCP tool simply executes the equivalent CLI command and returns structured output.
//
// Example tool mapping:
//   MCP tool: mf_create_scene → CLI: mf scene create --json
//   MCP tool: mf_add_text    → CLI: mf text add "..." --json
//   MCP tool: mf_render      → CLI: mf render --json
//
// This ensures a single source of truth (the CLI) with MCP as a convenience layer.

export async function startMCPServer(_port?: number): Promise<void> {
  // Placeholder — MCP server implementation will be added in Phase 2
  throw new Error('MCP server not yet implemented. Use CLI + Skills for agent integration.');
}
