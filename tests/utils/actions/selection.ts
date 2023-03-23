import type { Page } from '@playwright/test';

export async function getRichTextBoundingBox(
  page: Page,
  blockId: string
): Promise<DOMRect> {
  return await page.evaluate(id => {
    const paragraph = document.querySelector(
      `[data-block-id="${id}"] .virgo-editor`
    );
    const bbox = paragraph?.getBoundingClientRect() as DOMRect;
    return bbox;
  }, blockId);
}

async function scrollToDistance(page: Page, distance: number) {
  await page.evaluate(distance => {
    const viewport = document.querySelector('.affine-default-viewport');
    if (!viewport) {
      throw new Error();
    }
    viewport.scrollTo(0, distance);
  }, distance);
}

async function getViewportAndContainer(page: Page) {
  return await page.evaluate(() => {
    const viewport = document.querySelector('.affine-default-viewport');
    if (!viewport) {
      throw new Error();
    }
    const container = viewport.querySelector(
      'affine-frame .affine-block-children-container'
    );
    if (!container) {
      throw new Error();
    }
    return { viewport, container };
  });
}

async function getFirstAndLastElements(page: Page) {
  const { container } = await getViewportAndContainer(page);
  const first = container.firstElementChild;
  const last = container.lastElementChild;
  if (!first || !last) {
    throw new Error();
  }
  return { first, last };
}
