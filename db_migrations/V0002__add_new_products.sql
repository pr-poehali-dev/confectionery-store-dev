INSERT INTO products (name, description, price, image_url) VALUES 
('Круассан', 'Воздушный французский круассан с хрустящей корочкой', 120, 'https://cdn.poehali.dev/projects/8036eb89-49de-4b13-9a58-8a685d1c722f/files/5b20c148-dc4c-4adc-827b-bf650689595d.jpg'),
('Эклер шоколадный', 'Нежный эклер с заварным кремом в шоколадной глазури', 95, 'https://cdn.poehali.dev/projects/8036eb89-49de-4b13-9a58-8a685d1c722f/files/0174bb1d-9318-471e-9d13-aa0680eb0ead.jpg'),
('Булочка с корицей', 'Ароматная булочка с корицей и сливочной глазурью', 75, 'https://cdn.poehali.dev/projects/8036eb89-49de-4b13-9a58-8a685d1c722f/files/d8530241-fa5f-4e2a-aad8-8b01e8172433.jpg')
ON CONFLICT DO NOTHING;