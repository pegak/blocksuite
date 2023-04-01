import type { ColumnSchemaType } from '@blocksuite/global/database';
import { type Page } from '@playwright/test';

import { assertClassName } from '../asserts.js';

export async function doColumnAction(
  page: Page,
  columnId: string,
  action: string
) {
  const titleRow = page.locator('.affine-database-column-header');
  const columnTitle = titleRow.locator(`[data-column-id="${columnId}"]`);
  await columnTitle.click();

  const actionMenu = page.locator(`.${action}`);
  await actionMenu.click();
}

export async function switchColumnType(
  page: Page,
  columnType: ColumnSchemaType,
  columnId = '3',
  isDefault = false
) {
  const titleRow = page.locator('.affine-database-column-header');
  const columnTitle = titleRow.locator(`[data-column-id="${columnId}"]`);
  await columnTitle.click();

  const action = page.locator('.column-type');
  const box = await action.boundingBox();
  if (!box) throw new Error('Missing column type rect');
  page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

  if (isDefault) {
    await assertClassName(
      page,
      '.action.multi-select',
      /action multi-select selected/
    );
  }

  const typeMenu = page.locator(
    `.affine-database-column-type-popup .${columnType}`
  );
  await typeMenu.click();
}

export function getFirstColumnCell(page: Page, cellClass: string) {
  const cellSelector = '[data-row-id="4"][data-column-id="3"]';
  const cell = page.locator(cellSelector);
  const cellContent = cell.locator(`.${cellClass}`);
  return cellContent;
}