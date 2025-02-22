import type { BaseBlockModel } from '@blocksuite/store';
import { assertExists } from '@blocksuite/store';

import { getService } from '../__internal__/service.js';
import { BaseService } from '../__internal__/service/index.js';
import type {
  BlockTransformContext,
  SerializedBlock,
} from '../__internal__/utils/index.js';
import type { PageBlockModel } from './page-model.js';

export class PageBlockService extends BaseService<PageBlockModel> {
  override block2html(
    block: PageBlockModel,
    { childText = '', begin, end }: BlockTransformContext = {}
  ) {
    return `<div>${block.title.toString()}${childText}</div>`;
  }

  override block2Text(
    block: PageBlockModel,
    { childText = '', begin, end }: BlockTransformContext = {}
  ) {
    const text = (block.title.toString() || '').slice(begin || 0, end);
    return `${text}${childText}`;
  }

  override async json2Block(
    focusedBlockModel: BaseBlockModel,
    pastedBlocks: SerializedBlock[]
  ) {
    if (pastedBlocks.length > 0 && pastedBlocks[0].children.length === 0) {
      (focusedBlockModel as PageBlockModel).title.applyDelta(
        pastedBlocks[0].text || []
      );
      pastedBlocks = pastedBlocks.slice(1);
    }
    // this is page block empty case
    const frameId = focusedBlockModel.page.addBlock(
      'affine:frame',
      {},
      focusedBlockModel.id
    );
    const frameModel = focusedBlockModel.page.getBlockById(frameId);
    assertExists(frameModel);
    const service = getService('affine:frame');
    return service.json2Block(frameModel, pastedBlocks);
    // TODO: if page is not empty
  }
}
