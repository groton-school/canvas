# @groton/canvas-lti-configuration

JSON intellisense and schema for Canvas LTI configuration documents

## JSON intellisense and validation

### Install

```bash
pnpm install --dev @groton/canvas-lti-configuration
```

### Use

```json
{
  "$schema": "./node_modules/@groton/canvas-lti-configuration/schema.json",
  "title": "My LTI",
  "description": "A custom learning tool",
  "oidc_initiation_url": "https://example.com/login",
  "target_link_uri": "https://example.com/launch"
}
```

## TypeScript

### Install

```bash
pnpm install @groton/canvas-lti-configuration zod
```

### Use

```ts
import { schema } from '@groton/canvas-lti-configuration';

const configuration: string = '...';

const { data, error } = schema.safeParse(configuration);
if (error) {
  console.error(error);
} else {
  console.log(data);
}
```
