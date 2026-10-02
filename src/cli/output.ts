/**
 * MotionForge — CLI Output Utility
 *
 * Handles both human-readable and JSON output for agent consumption.
 */

import type { CLIOutput } from '../core/types.js';

/**
 * Print output in human-readable or JSON format.
 */
export function output<T>(json: boolean, data: CLIOutput<T>): void {
  if (json) {
    process.stdout.write(JSON.stringify(data, null, 2) + '\n');
  } else {
    if (data.success) {
      process.stdout.write(`✓ ${data.message}\n`);
    } else {
      process.stderr.write(`✗ ${data.message}\n`);
      if (data.errors) {
        for (const err of data.errors) {
          process.stderr.write(`  - ${err}\n`);
        }
      }
    }
  }
}
