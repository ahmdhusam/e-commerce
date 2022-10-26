import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesService } from 'src/shared/services';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ProductDataDto } from './dtos';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>,
    private readonly imagesService: ImagesService,
  ) {}

  create(author: User, productData: ProductDataDto): Promise<Product> {
    return this.productsRepo.create({ ...productData, author }).save();
  }

  getProducts(limit: number, skip: number): Promise<Product[]> {
    return this.productsRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });
  }

  async update(user: User, productId: string, productData: Omit<UpdateProductDto, 'id'>): Promise<Product> {
    const product = await this.getOneById(productId);
    this.isAuthorized(user, product);

    if (productData.images) await this.deleteImages(product.images);

    Object.assign(product, productData);
    return product.save();
  }

  async productToCart(productId: string, quantity: number): Promise<Product> {
    const product = await this.getOneById(productId);
    if (quantity > product.quantity)
      throw new BadRequestException('the quantity should be smaller than the quantity of the product');

    product.quantity -= quantity;
    product.inOrder += quantity;

    return product;
  }

  async reverseFromCart(productId: string, quantity: number): Promise<Product> {
    const product = await this.getOneById(productId);
    if (quantity > product.inOrder) throw new BadRequestException();

    product.quantity += quantity;
    product.inOrder -= quantity;

    return product;
  }

  async delete(user: User, productId: string): Promise<Product> {
    const product = await this.getOneById(productId);
    this.isAuthorized(user, product);

    await product.remove();
    await this.deleteImages(product.images);

    return product;
  }

  private async deleteImages(imagesPath: string[]): Promise<void> {
    await Promise.all(imagesPath.map(imagePath => this.imagesService.deleteImage(imagePath)));
  }

  private isAuthorized(user: User, product: Product): void {
    if (product.author.id !== user.id) throw new UnauthorizedException();
  }

  getOneById(productId: string): Promise<Product> {
    return this.productsRepo.findOneOrFail({ where: { id: productId }, relations: ['author'] }).catch(() => {
      throw new NotFoundException('product Not Found');
    });
  }
}
