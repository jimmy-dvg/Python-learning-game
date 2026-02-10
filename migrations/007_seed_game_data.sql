-- Seed game data from gameSchema.js
-- Levels
INSERT INTO public.levels (id, title, description, xp_reward, prerequisites, sort_order)
VALUES 
('variables', 'Variables and Data Types', 'Learn about Strings, Integers, Floats, and Booleans', 100, '{}', 1),
('conditionals', 'Conditionals', 'Learn about If, Elif, Else, and Comparisons', 150, '{"variables"}', 2),
('loops', 'Loops', 'Learn about For loops, While loops, and Iterating', 200, '{"conditionals"}', 3),
('functions', 'Functions', 'Learn about Parameters, Return values, and Scope', 300, '{"loops"}', 4),
('objects', 'Classes and Objects', 'Learn about Attributes, Methods, and Inheritance', 500, '{"functions"}', 5)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  xp_reward = EXCLUDED.xp_reward,
  prerequisites = EXCLUDED.prerequisites,
  sort_order = EXCLUDED.sort_order;

-- Challenges
INSERT INTO public.challenges (id, level_id, type, prompt, starter_code, test_schema, hints, xp_reward)
VALUES 
('var-1', 'variables', 'code', 'Assign the integer 42 to a variable named ''answer''.', '# Your code here\n', '[{"name": "Exists", "check": "assert ''answer'' in locals()"}, {"name": "Value", "check": "assert answer == 42"}]'::jsonb, ARRAY['Variable names go on the left of the = sign.'], 20),
('cond-1', 'conditionals', 'code', 'Create an if-statement that checks if ''score'' is greater than 50. If true, set ''passed'' to True.', 'score = 75\n# Your code here\n', '[{"name": "Result", "check": "assert passed == True"}]'::jsonb, ARRAY['Don''t forget the colon (:) at the end of the if statement.'], 30),
('loop-1', 'loops', 'code', 'Use a for loop to calculate the sum of numbers 1 to 5.', 'total = 0\n# Your code here\n', '[{"name": "Summation", "check": "assert total == 15"}]'::jsonb, ARRAY['Use the range(1, 6) function to get numbers 1 to 5.'], 40),
('func-1', 'functions', 'code', 'Define a function ''greet'' that takes a ''name'' and returns ''Hello, <name>''.', 'def greet(name):\n    # Your code here\n', '[{"name": "Output", "check": "assert greet(''World'') == ''Hello, World''"}]'::jsonb, ARRAY['Use f-strings or concatenation.'], 50),
('obj-1', 'objects', 'code', 'Create a class ''Pet'' with an ''__init__'' method that sets ''self.name''.', 'class Pet:\n    # Your code here\n', '[{"name": "Instance", "check": "assert Pet(''Fluffy'').name == ''Fluffy''"}]'::jsonb, ARRAY['The first parameter of any class method should be ''self''.'], 100)
ON CONFLICT (id) DO UPDATE SET 
  level_id = EXCLUDED.level_id,
  type = EXCLUDED.type,
  prompt = EXCLUDED.prompt,
  starter_code = EXCLUDED.starter_code,
  test_schema = EXCLUDED.test_schema,
  hints = EXCLUDED.hints,
  xp_reward = EXCLUDED.xp_reward;
