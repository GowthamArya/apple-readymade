"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, theme } from 'antd';
import { ReloadOutlined, CloseOutlined } from '@ant-design/icons';
import { useGame } from '../context/GameContext';

const OfflineGame = () => {
    const { isGameOpen, closeGame } = useGame();
    const [isOffline, setIsOffline] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    // Ant Design tokens for theming
    const { token } = theme.useToken();

    useEffect(() => {
        // Hydration fix / window check
        if (typeof window === 'undefined') return;

        const handleOffline = () => {
            setIsOffline(true);
            setGameStarted(true); // Auto start if disconnected
        };
        const handleOnline = () => setIsOffline(false);

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        // Initial check
        setIsOffline(!navigator.onLine);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    // Effect to start game if opened manually via context
    useEffect(() => {
        if (isGameOpen && !gameStarted) {
            setGameStarted(true);
            setGameOver(false);
            setScore(0);
        }
    }, [isGameOpen, gameStarted]); // Added gameStarted to dependencies to prevent infinite loop if gameStarted is true initially

    useEffect(() => {
        // Run logic if offline OR game is manually open
        const isVisible = isOffline || isGameOpen;
        if (!isVisible || !gameStarted || gameOver) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let apples: { x: number; y: number; speed: number; id: number }[] = [];
        let basketX = canvas.width / 2;
        const basketWidth = 60;
        const basketHeight = 40;
        const appleRadius = 15;
        let frameCount = 0;
        let currentScore = score; // Use local var to avoid closure stale state issue if dependence isn't perfect, but we re-bind on gameOver change so it is fine.
        // Actually, best to rely on refs or simple restart logic.
        // We will stick to the previous pattern but ensure variables are fresh.

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            basketX = canvas.width / 2; // ongoing game might jump, but acceptable
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Input handling
        const handleMouseMove = (e: MouseEvent) => {
            basketX = e.clientX;
        };
        const handleTouchMove = (e: TouchEvent) => {
            basketX = e.touches[0].clientX;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('touchmove', handleTouchMove);

        const gameLoop = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background text or styling
            if (!gameStarted) return;

            // Spawn apples - drastically slower base rate
            // Base: 90 frames (~1.5s). Cap at 40 frames min.
            const spawnRate = Math.max(40, 90 - Math.floor(currentScore / 2));

            if (frameCount % spawnRate === 0) {
                apples.push({
                    x: Math.random() * (canvas.width - appleRadius * 2) + appleRadius,
                    y: -appleRadius,
                    // Start slower (1-3px/frame) and increase speed slightly
                    speed: (1 + Math.random() * 2) * (1 + currentScore * 0.02),
                    id: Math.random()
                });
            }

            // Update and draw apples
            for (let i = apples.length - 1; i >= 0; i--) {
                const apple = apples[i];
                apple.y += apple.speed;

                // Draw Apple (Green)
                ctx.beginPath();
                ctx.arc(apple.x, apple.y, appleRadius, 0, Math.PI * 2);
                ctx.fillStyle = '#73d13d'; // Green Apple
                ctx.fill();
                ctx.strokeStyle = '#237804';
                ctx.stroke();

                // Leaf (Darker Green)
                ctx.beginPath();
                ctx.ellipse(apple.x + 5, apple.y - 15, 8, 4, Math.PI / 4, 0, Math.PI * 2);
                ctx.fillStyle = '#237804'; // Dark Green Leaf
                ctx.fill();

                // Collision Detection with floor
                if (apple.y > canvas.height) {
                    apples.splice(i, 1);
                    // Missed an apple? Game over? Or just lose points?
                    // Let's make it simple: Miss 5 apples = Game Over?
                    // Or catch creates score. One miss = Game Over for challenge.
                    setGameOver(true);
                    setGameStarted(false);
                    return; // Stop loop
                }

                // Collision with Basket
                if (
                    apple.y + appleRadius >= canvas.height - basketHeight &&
                    apple.x >= basketX - basketWidth / 2 &&
                    apple.x <= basketX + basketWidth / 2
                ) {
                    apples.splice(i, 1);
                    currentScore += 1;
                    setScore(currentScore);
                }
            }

            // Draw Basket
            ctx.fillStyle = '#874d00'; // Brownish
            ctx.fillRect(basketX - basketWidth / 2, canvas.height - basketHeight, basketWidth, basketHeight);

            // Draw basket texture/details
            ctx.strokeStyle = '#5b3200';
            ctx.lineWidth = 2;
            ctx.strokeRect(basketX - basketWidth / 2, canvas.height - basketHeight, basketWidth, basketHeight);

            frameCount++;
            animationFrameId = requestAnimationFrame(gameLoop);
        };

        gameLoop();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isOffline, isGameOpen, gameStarted, gameOver, score]); // Added score to dependencies to ensure currentScore is up-to-date

    const startGame = () => {
        setScore(0);
        setGameOver(false);
        setGameStarted(true);
    };

    const isVisible = isOffline || isGameOpen;

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            backgroundColor: token.colorBgContainer, // Use theme background
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: token.colorText,
        }}>
            {/* Close Button if Online and Manually Opened */}
            {!isOffline && (
                <div className="absolute top-5 right-5 z-20">
                    <Button
                        shape="circle"
                        icon={<CloseOutlined />}
                        size="large"
                        onClick={closeGame}
                    />
                </div>
            )}

            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    display: gameStarted && !gameOver ? 'block' : 'none'
                }}
            />

            <div style={{
                zIndex: 10,
                textAlign: 'center',
                padding: 20,
                backgroundColor: gameStarted && !gameOver ? 'rgba(255,255,255,0.8)' : 'transparent',
                borderRadius: 16
            }}>
                <Typography.Title level={2}>
                    {gameOver ? "Game Over!" : !gameStarted ? (isOffline ? "You are Offline" : "Catch the Apple!") : `Score: ${score}`}
                </Typography.Title>

                {!gameStarted ? (
                    <>
                        <Typography.Paragraph>
                            {gameOver
                                ? `You caught ${score} apples!`
                                : isOffline
                                    ? "Looks like you lost your internet connection. While you wait, why not catch some apples?"
                                    : "Bored? Catch as many green apples as you can!"}
                        </Typography.Paragraph>
                        <Button
                            type="primary"
                            size="large"
                            icon={<ReloadOutlined />}
                            onClick={startGame}
                            className="mt-4"
                        >
                            {gameOver ? "Play Again" : "Start Game"}
                        </Button>
                        {!gameOver && isOffline && ( // Only show "Check your connection" if offline and not game over
                            <Typography.Text type="secondary" className="block mt-8">
                                Check your connection...
                            </Typography.Text>
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default OfflineGame;
