import {
  copyableJsonPath,
  formatJson,
  generateTypeScriptDefinitions,
  normalizeJsonValue,
  parseJsonInput,
} from '@/utils/json';

describe('json utils', () => {
  it('parses valid JSONC input', () => {
    const result = parseJsonInput('{\n  // comment\n  "name": "json-studio",\n}');
    expect(result.valid).toBe(true);
    expect(result.value).toEqual({ name: 'json-studio' });
  });

  it('reports line and column for invalid input', () => {
    const result = parseJsonInput('{\n  "name":\n}');
    expect(result.valid).toBe(false);
    expect(result.location?.line).toBe(3);
  });

  it('normalizes and formats JSON', () => {
    const result = formatJson('{"z":null,"a":{"empty":[],"name":"demo"}}', {
      sortKeys: true,
      removeNulls: true,
      removeEmpty: true,
    });

    expect(result.output).toBe('{\n  "a": {\n    "name": "demo"\n  }\n}');
  });

  it('generates typescript definitions', () => {
    const output = generateTypeScriptDefinitions('root_payload', {
      user: {
        id: 1,
        name: 'demo',
      },
      tags: ['a', 'b'],
    });

    expect(output).toContain('export interface RootPayload');
    expect(output).toContain('export interface RootPayloadUser');
    expect(output).toContain('tags: (string)[];');
  });

  it('creates copy-friendly json paths', () => {
    expect(copyableJsonPath(['users', 0, 'display-name'])).toBe("$.users[0]['display-name']");
  });

  it('removes nested empty values', () => {
    const normalized = normalizeJsonValue(
      {
        profile: {
          bio: '',
          social: {},
          active: true,
        },
        tags: [],
      },
      {
        removeEmpty: true,
        removeNulls: false,
        sortKeys: false,
      },
    );

    expect(normalized).toEqual({
      profile: {
        active: true,
      },
    });
  });
});
