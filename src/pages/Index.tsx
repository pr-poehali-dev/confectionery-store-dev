import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Буханка хлеба',
    price: 85,
    image: 'https://avatars.mds.yandex.net/i?id=ef6745c6d36fd247da9b36b4bdbf487a1b7578a6-3521501-images-thumbs&n=13',
    description: 'Свежий ароматный хлеб, испечённый по традиционному рецепту'
  },
  {
    id: 2,
    name: 'Сосиска в тесте',
    price: 65,
    image: 'https://avatars.mds.yandex.net/i?id=b2d4b31b7c90d4addf42dd1470551935d8ff4681-5869421-images-thumbs&n=13',
    description: 'Нежное тесто с сочной сосиской - идеальный перекус'
  }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ email: '', name: '' });
  const [showAuth, setShowAuth] = useState(false);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast({
      title: 'Добавлено в корзину',
      description: `${product.name} добавлен в вашу корзину`,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAuth = (e: React.FormEvent<HTMLFormElement>, isLogin: boolean) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    
    setUser({ email, name: name || email.split('@')[0] });
    setIsLoggedIn(true);
    setShowAuth(false);
    toast({
      title: isLogin ? 'Добро пожаловать!' : 'Регистрация успешна',
      description: `Вы вошли как ${email}`,
    });
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowAuth(true);
      toast({
        title: 'Требуется авторизация',
        description: 'Пожалуйста, войдите или зарегистрируйтесь для оформления заказа',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Заказ оформлен!',
      description: `Сумма к оплате: ${totalAmount} ₽. Переведите на карту: 2200 7012 3217 5569`,
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({ email: '', name: '' });
    toast({
      title: 'Вы вышли из аккаунта',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Cake" size={32} className="text-primary" />
            <h1 className="text-3xl font-bold text-primary">Коржик</h1>
          </div>
          
          <nav className="flex items-center gap-6">
            <a href="#catalog" className="text-sm font-medium hover:text-primary transition-colors">
              Каталог
            </a>
            <a href="#delivery" className="text-sm font-medium hover:text-primary transition-colors">
              Доставка
            </a>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                  <SheetDescription>
                    {cart.length === 0 ? 'Корзина пуста' : `Товаров: ${cart.length}`}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 items-center border-b pb-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                          <Icon name="Minus" size={16} />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)}>
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
                
                {cart.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Итого:</span>
                      <span>{totalAmount} ₽</span>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleCheckout}>
                      Оформить заказ
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            <Dialog open={showAuth} onOpenChange={setShowAuth}>
              <DialogTrigger asChild>
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Icon name="User" size={20} />
                    </Button>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{user.name}</span>
                      <Button variant="link" className="h-auto p-0 text-xs" onClick={logout}>
                        Выйти
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="default">
                    <Icon name="User" size={20} className="mr-2" />
                    Войти
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Личный кабинет</DialogTitle>
                  <DialogDescription>
                    Войдите или создайте новый аккаунт
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Вход</TabsTrigger>
                    <TabsTrigger value="register">Регистрация</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={(e) => handleAuth(e, true)} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email</Label>
                        <Input id="login-email" name="email" type="email" placeholder="your@email.com" required />
                      </div>
                      <div>
                        <Label htmlFor="login-password">Пароль</Label>
                        <Input id="login-password" name="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full">Войти</Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={(e) => handleAuth(e, false)} className="space-y-4">
                      <div>
                        <Label htmlFor="register-name">Имя</Label>
                        <Input id="register-name" name="name" placeholder="Иван Иванов" required />
                      </div>
                      <div>
                        <Label htmlFor="register-email">Email</Label>
                        <Input id="register-email" name="email" type="email" placeholder="your@email.com" required />
                      </div>
                      <div>
                        <Label htmlFor="register-password">Пароль</Label>
                        <Input id="register-password" name="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full">Зарегистрироваться</Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-accent/20 to-background py-20">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
            <h2 className="text-5xl md:text-7xl font-bold text-primary">
              Кондитерская Коржик
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Свежая выпечка каждый день. Традиционные рецепты, натуральные ингредиенты.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="text-lg" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
                Смотреть каталог
                <Icon name="ArrowDown" size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16 bg-card">
        <div className="container">
          <h3 className="text-4xl font-bold text-center mb-12 text-primary">Наши товары</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-scale-in">
                <CardHeader className="p-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-64 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <p className="text-3xl font-bold text-primary">{product.price} ₽</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => addToCart(product)}>
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    В корзину
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="delivery" className="py-16 bg-background">
        <div className="container max-w-4xl">
          <h3 className="text-4xl font-bold text-center mb-12 text-primary">Доставка и оплата</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Truck" size={24} />
                  Доставка
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>🚚 Доставка по городу — 200 ₽</p>
                <p>📦 Бесплатная доставка от 1000 ₽</p>
                <p>⏰ Время доставки: 1-2 часа</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="CreditCard" size={24} />
                  Оплата
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>💳 Переводом на карту</p>
                <p className="font-mono font-semibold">2200 7012 3217 5569</p>
                <p className="text-sm text-muted-foreground">После оформления заказа переведите сумму на указанную карту</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t py-8">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Cake" size={24} className="text-primary" />
            <span className="text-xl font-bold">Кондитерская Коржик</span>
          </div>
          <p className="text-muted-foreground">© 2024 Все права защищены</p>
        </div>
      </footer>
    </div>
  );
}
