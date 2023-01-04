import { merge } from 'lodash';

export const UUIDRegexString =
  '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

INSERT INTO puzzle_instance_actions (
  id,
  puzzle_instance_id,
  user_id,
  sequence_number,
  payload
    '       ) VALUES (\n' +
    "          '48d4c082-3290-425a-88de-fa5ec131bbba',\n" +
    "          '7bc58c51-d2a4-4d43-8b72-6cfe90d6cdee',\n" +
    "          '4f88f414-64d5-480d-a556-9b648fe434b4',\n" +
    "          (SELECT COUNT(*) + 1 FROM puzzle_instance_actions WHERE puzzle_instance_id = '7bc58c51-d2a4-4d43-8b72-6cfe90d6cdee'),\n" +
    `          '{"4f88f414-64d5-480d-a556-9b648fe434b4":true}'\n` +
    '        );
