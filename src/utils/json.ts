import { parse as parseJsonc, printParseErrorCode, type ParseError } from 'jsonc-parser';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface JsonErrorLocation {
  line: number;
  column: number;
  offset: number;
}

export interface JsonValidationResult {
  valid: boolean;
  value: JsonValue | null;
  message: string;
  location?: JsonErrorLocation;
}

export interface FormatOptions {
  indentSize?: number;
  minify?: boolean;
  sortKeys?: boolean;
  removeNulls?: boolean;
  removeEmpty?: boolean;
}

export interface JsonTextStats {
  lines: number;
  characters: number;
}

export const SAMPLE_JSON = `{
  "companyName": "珠海市智寻科技有限公司",
  "companyNameEn": "Zhuhai Zhixun Technology Co., Ltd.",
  "website": "https://www.ideaseek.cn",
  "province": "广东省",
  "city": "珠海市",
  "businessCategory": "软件开发",
  "contact": {
    "region": "South China",
    "timezone": "Asia/Shanghai"
  },
  "services": [
    "software development",
    "digital solutions",
    "technical consulting"
  ],
  "metadata": {
    "isLocalProcessing": true,
    "dataFormat": "json"
  }
}`;

function offsetToLocation(source: string, offset: number): JsonErrorLocation {
  const safeOffset = Math.min(Math.max(offset, 0), source.length);
  const slice = source.slice(0, safeOffset);
  const lines = slice.split('\n');
  const lastLine = lines[lines.length - 1] ?? '';
  return {
    line: lines.length,
    column: lastLine.length + 1,
    offset: safeOffset,
  };
}

function isPlainObject(value: JsonValue): value is Record<string, JsonValue> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isEmptyValue(value: JsonValue): boolean {
  if (value === '') {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (isPlainObject(value)) {
    return Object.keys(value).length === 0;
  }
  return false;
}

export function parseJsonInput(source: string): JsonValidationResult {
  const errors: ParseError[] = [];
  const value = parseJsonc(source, errors, {
    allowTrailingComma: true,
    disallowComments: false,
    allowEmptyContent: false,
  }) as JsonValue | undefined;

  if (errors.length > 0) {
    const first = errors[0];
    const location = offsetToLocation(source, first.offset);
    return {
      valid: false,
      value: null,
      message: `JSON 解析失败：${printParseErrorCode(first.error)}`,
      location,
    };
  }

  return {
    valid: true,
    value: value ?? null,
    message: 'JSON 合法，可安全在浏览器本地处理。',
  };
}

export function normalizeJsonValue(
  value: JsonValue,
  options: Pick<FormatOptions, 'sortKeys' | 'removeNulls' | 'removeEmpty'>,
): JsonValue {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => normalizeJsonValue(item, options))
      .filter((item) => {
        if (options.removeNulls && item === null) {
          return false;
        }
        if (options.removeEmpty && isEmptyValue(item)) {
          return false;
        }
        return true;
      });

    return items;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value)
      .map(([key, item]) => [key, normalizeJsonValue(item, options)] as const)
      .filter(([, item]) => {
        if (options.removeNulls && item === null) {
          return false;
        }
        if (options.removeEmpty && isEmptyValue(item)) {
          return false;
        }
        return true;
      });

    if (options.sortKeys) {
      entries.sort(([left], [right]) => left.localeCompare(right));
    }

    return Object.fromEntries(entries);
  }

  return value;
}

export function formatJson(source: string, options: FormatOptions = {}): JsonValidationResult & { output: string } {
  const validation = parseJsonInput(source);
  if (!validation.valid || validation.value === null) {
    return {
      ...validation,
      output: '',
    };
  }

  const normalized = normalizeJsonValue(validation.value, {
    sortKeys: options.sortKeys ?? false,
    removeNulls: options.removeNulls ?? false,
    removeEmpty: options.removeEmpty ?? false,
  });

  return {
    ...validation,
    value: normalized,
    output: JSON.stringify(normalized, null, options.minify ? 0 : options.indentSize ?? 2),
  };
}

function toPascalCase(input: string): string {
  const cleaned = input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim();

  if (!cleaned) {
    return 'GeneratedType';
  }

  return cleaned
    .split(/\s+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

function sanitizeFieldName(input: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(input) ? input : `'${input}'`;
}

function unionTypes(values: string[]): string {
  return [...new Set(values)].sort().join(' | ');
}

export function generateTypeScriptDefinitions(rootName: string, source: JsonValue): string {
  const declarations: string[] = [];
  const declared = new Set<string>();

  function inferType(name: string, value: JsonValue): string {
    if (value === null) {
      return 'null';
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return 'unknown[]';
      }

      const elementTypes = value.map((item, index) => inferType(`${name}Item${index + 1}`, item));
      return `(${unionTypes(elementTypes)})[]`;
    }
    if (typeof value === 'object') {
      const interfaceName = toPascalCase(name);
      if (!declared.has(interfaceName)) {
        declared.add(interfaceName);
        const body = Object.entries(value)
          .map(([key, nested]) => `  ${sanitizeFieldName(key)}: ${inferType(`${interfaceName}${toPascalCase(key)}`, nested)};`)
          .join('\n');

        declarations.push(`export interface ${interfaceName} {\n${body || '  [key: string]: never;'}\n}`);
      }
      return interfaceName;
    }
    if (typeof value === 'string') {
      return 'string';
    }
    if (typeof value === 'number') {
      return 'number';
    }
    return 'boolean';
  }

  inferType(rootName, source);
  return declarations.join('\n\n');
}

export function copyableJsonPath(path: Array<string | number>): string {
  if (path.length === 0) {
    return '$';
  }

  return path.reduce<string>((accumulator, segment) => {
    if (typeof segment === 'number') {
      return `${accumulator}[${segment}]`;
    }
    if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(segment)) {
      return `${accumulator}.${segment}`;
    }
    return `${accumulator}['${segment}']`;
  }, '$');
}

export function countJsonTextStats(source: string): JsonTextStats {
  return {
    lines: source ? source.split('\n').length : 1,
    characters: source.length,
  };
}

export function escapeHtml(source: string): string {
  return source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function highlightJsonHtml(source: string): string {
  const escaped = escapeHtml(source);
  return escaped.replace(
    /(&quot;(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\&]|&(?!quot;))*&quot;)(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g,
    (match, stringToken, keyMarker, keywordToken, numberToken) => {
      if (stringToken) {
        if (keyMarker) {
          return `<span class="token token-key">${stringToken}</span><span class="token token-punctuation">${keyMarker}</span>`;
        }
        return `<span class="token token-string">${stringToken}</span>`;
      }
      if (keywordToken) {
        const keywordClass = keywordToken === 'null' ? 'token-null' : 'token-boolean';
        return `<span class="token ${keywordClass}">${keywordToken}</span>`;
      }
      if (numberToken) {
        return `<span class="token token-number">${numberToken}</span>`;
      }
      return match;
    },
  );
}
