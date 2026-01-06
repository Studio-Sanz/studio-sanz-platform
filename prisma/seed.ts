/**
 * Script de seeding para crear usuario admin
 * IMPORTANTE: El servidor debe estar corriendo (npm run dev) en otra terminal
 */

async function createAdminUser() {
  const email = 'admin@studiosanz.com';
  const password = 'admin123';
  const name = 'Admin';
  const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

  console.log('\n🌱 Starting database seeding...');
  console.log('📧 Email:', email);
  console.log('👤 Name:', name);
  console.log('\n⚠️  Make sure the dev server is running (npm run dev) in another terminal!\n');

  try {
    const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': baseUrl,
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400 && data.message?.includes('already exists')) {
        console.log('⚠️  Admin user already exists!');
        console.log('\n✅ You can login with:');
        console.log('   Email:', email);
        console.log('   Password:', password);
        console.log('\n🌐 Access the admin panel at:', `${baseUrl}/login`);
        return;
      }
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('✅ Admin user created successfully!');
    console.log('🆔 User ID:', data.user?.id);
    console.log('\n📝 Login credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('\n🌐 Access the admin panel at:', `${baseUrl}/login`);
  } catch (error: unknown) {
    const err = error as Error & { cause?: { code?: string } };
    if (err.cause?.code === 'ECONNREFUSED') {
      console.error('\n❌ Error: Cannot connect to the server!');
      console.error('   Make sure the dev server is running:');
      console.error('   Run \'npm run dev\' in another terminal first.\n');
    } else {
      console.error('\n❌ Error creating admin user:');
      console.error('  ', err.message || String(error));
    }
    process.exit(1);
  }
}

createAdminUser();
