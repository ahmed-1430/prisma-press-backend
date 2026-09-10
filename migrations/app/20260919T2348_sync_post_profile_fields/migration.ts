#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/53a194776ea02fe8231fc4481c96a89b8e8d1a42237f1b5183237e13966e2f76/contract';
import startContract from '../../snapshots/53a194776ea02fe8231fc4481c96a89b8e8d1a42237f1b5183237e13966e2f76/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/a40ed268abcc5dcf828ad3a7b53dda7bbdb8ca60508ed04ce9b280f161406dca/contract';
import endContract from '../../snapshots/a40ed268abcc5dcf828ad3a7b53dda7bbdb8ca60508ed04ce9b280f161406dca/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'post',
        column: col('isFeatured', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'post',
        column: col('status', 'bool', {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'post',
        column: col('tags', 'text[]', { codecRef: { codecId: 'pg/text@1', many: true } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'post',
        column: col('thumbnail', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'post',
        column: col('views', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'post',
        constraint: 'post_tags_check_dcc99e44',
        expression:
          "\"tags\"::text[] <@ ARRAY['TECHNOLOGY', 'LIFESTYLE', 'TRAVEL', 'FOOD', 'FASHION', 'BUSINESS', 'ENTERTAINMENT', 'SPORTS', 'HEALTH', 'POLITICS']::text[]",
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'post',
        constraint: 'post_tags_elem_not_null_aecbe9e2',
        expression: 'array_position("tags", NULL) IS NULL',
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
