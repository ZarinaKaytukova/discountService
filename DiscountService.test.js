import { DiscountService } from './DiscountService.js';

describe('DiscountService', () => {
  let service;
  let mockStrategy;

  beforeEach(() => {
    service = new DiscountService();

    mockStrategy = {
      apply: jest.fn((price) => price * 0.8),
    };
  });

  it('Проверка установки стратегии скидок', () => {
    service.setDiscountStrategy(mockStrategy);
    expect(service.strategy).toBe(mockStrategy);
  });

  it('Проверка выбрасывания ошибки, если стратегия не установлена', () => {
    expect(() => service.getFinalPrice(100)).toThrow('Стратегия скидок не установлена');
  });

  it('Проверка возврата цены с учетом скидки ', () => {
    service.setDiscountStrategy(mockStrategy);
    const finalPrice = service.getFinalPrice(1000);
    expect(finalPrice).toBe(800);
    expect(mockStrategy.apply).toHaveBeenCalledWith(1000);
  });

  it('Проверка сохранения истории скидок', () => {
    service.setDiscountStrategy(mockStrategy);
    service.getFinalPrice(1000);
    const history = service.getDiscountHistory();
    expect(history).toEqual([{ originalPrice: 1000, discountedPrice: 800 }]);
  });

  it('Проверка очистки истории', () => {
    service.setDiscountStrategy(mockStrategy);
    service.getFinalPrice(1000);
    service.clearHistory();
    expect(service.getDiscountHistory()).toEqual([]);
  });

  it('Проверка работы с разными стратегиями', () => {
    const anotherMockStrategy = {
      apply: jest.fn((price) => price * 0.5),
    };


    service.setDiscountStrategy(anotherMockStrategy);
    const finalPrice = service.getFinalPrice(1000);
    expect(finalPrice).toBe(500);
    expect(anotherMockStrategy.apply).toHaveBeenCalledWith(1000);
  });
});