export class Item {
  constructor(public title: string,
              public tag: string,
              public brandId: string,
              public price: number,
              public url: string,
              public rank: number,
              public featured: boolean,
              public imageUrl: string[],
              public collectionId: string,
              public itemId?: string) {
  }
}
